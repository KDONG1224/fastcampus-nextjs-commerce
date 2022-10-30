import styled from '@emotion/styled';
import { Button } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { OrderDetailItem } from 'components';
import { Cart, OrderItem, Orders, products } from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import {
  blurDataURL,
  CART_QUERY_KEY,
  CATEGORY_NAME,
  ORDER_QUERY_KEY
} from 'const';
import { useRouter } from 'next/router';

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`;

export interface OrderItemDetailProps extends OrderItem {
  name: string;
  image_url: string;
}

export interface OrderDetailProps extends Orders {
  orderItems: OrderItemDetailProps[];
}

const MyPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectId, setSelectId] = useState('');

  const { data } = useQuery<
    { items: OrderDetailProps[] },
    unknown,
    OrderDetailProps[]
  >([ORDER_QUERY_KEY], () =>
    fetch(ORDER_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  );

  const { mutate: updateOrderStatus } = useMutation<
    unknown,
    unknown,
    number,
    any
  >(
    (status) =>
      fetch('/api/update-order-status', {
        method: 'POST',
        body: JSON.stringify({ selectId, status })
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onSuccess: () => {
        // router.reload();
      },
      onError: (error) => {
        console.log(error);
      }
    }
  );

  const handlePayment = (id: number) => {
    setSelectId(String(id));
    updateOrderStatus(5);
    alert('결제 처리가 완료되었습니다.');
  };

  const handleCancel = (id: number) => {
    setSelectId(String(id));
    updateOrderStatus(-1);
    alert('결제 취소처리가 완료되었습니다.');
  };

  return (
    <div>
      <span className="text-2xl mb-3">주문내역 ({data ? data.length : 0})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data ? (
            data.length > 0 ? (
              data.map((item, idx) => (
                <OrderDetailItem
                  key={idx}
                  details={item}
                  onPayment={handlePayment}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div>주문내역이 없습니다.</div>
            )
          ) : (
            <div>불러오는 중....</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
