import { Cart } from '@prisma/client';
import { IconRefresh, IconX } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Count } from 'components';
import { CART_QUERY_KEY } from 'const';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CartItemProps } from 'pages/cart';
import { OrderItemDetailProps } from 'pages/my';
import React, { useEffect, useMemo, useState } from 'react';

interface ItemProps {
  items: OrderItemDetailProps;
}

export const OrderItmes: React.FC<ItemProps> = ({ items }) => {
  const { name, productId, price, quantity: quan, amount, image_url } = items;

  const [quantity, setQuantity] = useState<number | undefined>(quan);
  const [total, setTotal] = useState<number>(quantity as number);

  const router = useRouter();

  useEffect(() => {
    if (quantity != null) {
      return setTotal(quantity * price);
    }
  }, [quantity, price]);

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image
        src={image_url}
        alt={name}
        width={155}
        height={195}
        style={{
          cursor: 'pointer'
        }}
        onClick={() => router.push(`/products/${productId}`)}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{name}</span>
        <span className="mb-auto">
          가격 : {price.toLocaleString('ko-kr')}원
        </span>
        <div className="flex items-center space-x-4">
          <Count value={quantity} setValue={setQuantity} />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>합계 : {total.toLocaleString('ko-kr')}원</span>
      </div>
    </div>
  );
};
