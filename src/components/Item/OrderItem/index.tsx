import { Button } from '@mantine/core';
import { Count } from 'components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { OrderItemDetailProps } from 'pages/my';
import React, { useEffect, useState } from 'react';

interface ItemProps {
  items: OrderItemDetailProps;
  status: number;
}

export const OrderItmes: React.FC<ItemProps> = ({ items, status }) => {
  const { id, name, productId, price, quantity: quan, image_url } = items;

  const [quantity, setQuantity] = useState<number | undefined>(quan);
  const [total, setTotal] = useState<number>(quantity as number);

  const router = useRouter();

  const handleComment = () => {
    router.push(`/comment/edit?orderItemId=${id}`);
  };

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
          <Count value={quantity} setValue={setQuantity} disabled />
        </div>
      </div>
      <div className="flex flex-col ml-auto space-x-4">
        <span>합계 : {total.toLocaleString('ko-kr')}원</span>
        {status === 5 && (
          <Button
            style={{
              backgroundColor: 'black',
              color: 'white',
              marginTop: 'auto'
            }}
            onClick={handleComment}
          >
            후기 작성
          </Button>
        )}
      </div>
    </div>
  );
};
