import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetailItem } from 'components';
import { OrderItem, Orders } from '@prisma/client';
import React, { useState } from 'react';
import { CART_QUERY_KEY, ORDER_QUERY_KEY } from 'const';
import { useRouter } from 'next/router';

export interface OrderItemDetailProps extends OrderItem {
  name: string;
  image_url: string;
}

export interface OrderDetailProps extends Orders {
  orderItems: OrderItemDetailProps[];
}

const MyPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

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
        router.reload();
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
