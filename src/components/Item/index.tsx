import { IconRefresh, IconX } from '@tabler/icons';
import { Count } from 'components';
import Image from 'next/image';
import { CartItemProps } from 'pages/cart';
import React, { useEffect, useMemo, useState } from 'react';

interface ItemProps {
  cart: CartItemProps;
}

export const Item: React.FC<ItemProps> = ({ cart }) => {
  const { name, productId, price, quantity: quan, amount, image_url } = cart;

  const [quantity, setQuantity] = useState<number | undefined>(quan);
  const [total, setTotal] = useState<number>(quantity as number);

  // const totalPrice = useMemo(() => {
  //   if (quantity != null) {
  //     return quantity * price;
  //   }
  // }, [quantity, price]);

  useEffect(() => {
    if (quantity != null) {
      return setTotal(quantity * price);
    }
  }, [quantity, price]);

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image src={image_url} alt={name} width={155} height={195} />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{name}</span>
        <span className="mb-auto">
          가격 : {price.toLocaleString('ko-kr')}원
        </span>
        <div className="flex items-center space-x-4">
          <Count value={quantity} setValue={setQuantity} />
          <IconRefresh />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>합계 : {total.toLocaleString('ko-kr')}원</span>
        <IconX />
      </div>
    </div>
  );
};
