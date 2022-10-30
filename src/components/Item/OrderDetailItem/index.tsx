import React from 'react';
import { Badge, Button } from '@mantine/core';
import { IconX } from '@tabler/icons';
import { OrderItmes } from 'components';
import { ORDER_STATUS } from 'const';
import { format } from 'date-fns';
import { OrderDetailProps } from 'pages/my';

interface ItemProps {
  details: OrderDetailProps;
}

export const OrderDetailItem: React.FC<ItemProps> = ({ details }) => {
  const { status, orderItems, recevier, address, phoneNumber, createdAt } =
    details;

  return (
    <div
      className="w-full flex flex-col p-4 rounded-md"
      style={{ border: '1px solid grey' }}
    >
      <div className="flex">
        <Badge color={status === 0 ? 'red' : ''} className="mb-2">
          {ORDER_STATUS[status + 1]}
        </Badge>
        <IconX className="ml-auto" />
      </div>
      {orderItems.map((orderItem, idx) => (
        <OrderItmes key={idx} items={orderItem} />
      ))}

      <div className="flex mt-4">
        <div className="flex flex-col">
          <span className="mb-2">주문 정보</span>
          <span>받는사람 : {recevier ?? '입력 필요'}</span>
          <span>주소 : {address ?? '입력 필요'}</span>
          <span>연락처 : {phoneNumber ?? '입력 필요'}</span>
        </div>

        <div className="flex flex-col ml-auto mr-4 text-right">
          <span className="mb-2 font-semibold">
            합계 금액 :{' '}
            <span className="text-red-500">
              {orderItems
                .map((item) => item.amount)
                .reduce((prev, curr) => prev + curr, 0)
                .toLocaleString('ko-kr')}
              원
            </span>
          </span>
          <span className="text-zinc-400 mt-auto mb-auto">
            주문일자 : {format(new Date(createdAt), 'yyyy년 M월 d일 HH:mm:ss')}
          </span>
          <Button style={{ backgroundColor: 'black', color: 'white' }}>
            결제 처리
          </Button>
        </div>
      </div>
    </div>
  );
};
