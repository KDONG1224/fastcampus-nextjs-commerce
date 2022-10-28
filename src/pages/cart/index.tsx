import styled from '@emotion/styled';
import { Item } from 'components';
import React, { useEffect, useMemo, useState } from 'react';

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`;

export interface CartItemProps {
  name: string;
  productId: number;
  price: number;
  quantity: number;
  amount: number;
  image_url: string;
}

const dummyData: CartItemProps[] = [
  {
    name: '멋드러진 신발',
    productId: 100,
    price: 20000,
    quantity: 1,
    amount: 20000,
    image_url: 'https://picsum.photos/id/658/1000/600'
  },
  {
    name: '멋드러진 후드',
    productId: 211,
    price: 15000,
    quantity: 2,
    amount: 30000,
    image_url: 'https://picsum.photos/id/218/1000/600'
  }
];

const Cart = () => {
  const [data, setData] = useState<CartItemProps[]>([]);

  const deliveryFee = 5000;
  const discountAmout = 0;

  const totalPrice = useMemo(() => {
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0);
  }, [data]);

  useEffect(() => {
    setData(dummyData);
  }, []);

  return (
    <div>
      <span className="text-2xl mb-3">Cart ({data.length})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data.map((item, idx) => (
            <Item key={idx} cart={item} />
          ))}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4"
            style={{ minWidth: 300, border: '1px solid grey' }}
          >
            <div>Info</div>
            <Row>
              <span>금액</span>
              <span>{totalPrice.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>할인금액</span>
              <span>{discountAmout.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>배송비</span>
              <span>{deliveryFee.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span className="font-semibold">결제 금액</span>
              <span className="font-semibold text-red-500">
                {(totalPrice + deliveryFee - discountAmout).toLocaleString(
                  'ko-kr'
                )}{' '}
                원
              </span>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
