import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Button } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CartItem } from 'components';
import Image from 'next/image';
import { Cart, OrderItem, products } from '@prisma/client';
import { blurDataURL, CATEGORY_NAME, ORDERITEM_QUERY_KEY } from 'const';
import { useRouter } from 'next/router';

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`;

export interface CartItemProps extends Cart {
  name: string;
  price: number;
  image_url: string;
}

const CartPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery<
    { items: CartItemProps[] },
    unknown,
    CartItemProps[]
  >([`/api/get-cart`], () =>
    fetch(`/api/get-cart`)
      .then((res) => res.json())
      .then((data) => data.items)
  );

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    [`/api/get-products?skip=${Math.floor((Math.random() * 100) / 10)}&take=3`],
    () =>
      fetch(
        `/api/get-products?skip=${Math.floor(
          (Math.random() * 100) / 10
        )}&take=3`
      ).then((res) => res.json()),
    {
      select: (data) => data.items
    }
  );

  const { mutate: addOrder } = useMutation<
    unknown,
    unknown,
    Omit<OrderItem, 'id'>[],
    any
  >(
    (items) =>
      fetch(ORDERITEM_QUERY_KEY, {
        method: 'POST',
        body: JSON.stringify({ items })
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([ORDERITEM_QUERY_KEY]);
      },
      onSuccess: () => {
        router.push('/my');
      }
    }
  );

  const handleOrder = () => {
    if (data == null) return;

    addOrder(
      data.map((cart) => ({
        productId: cart.productId,
        price: cart.price,
        quantity: cart.quantity,
        amount: cart.amount
      }))
    );
  };

  const deliveryFee = data && data.length > 0 ? 5000 : 0;
  const discountAmout = 0;

  const totalPrice = useMemo(() => {
    if (data == null) {
      return 0;
    }

    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0);
  }, [data]);

  return (
    <div>
      <span className="text-2xl mb-3">Cart ({data ? data.length : 0})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data ? (
            data.length > 0 ? (
              data.map((item, idx) => <CartItem key={idx} cart={item} />)
            ) : (
              <div>??????????????? ????????? ????????????.</div>
            )
          ) : (
            <div>???????????? ???....</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4"
            style={{ minWidth: 300, border: '1px solid grey' }}
          >
            <div>Info</div>
            <Row>
              <span>??????</span>
              <span>{totalPrice.toLocaleString('ko-kr')} ???</span>
            </Row>
            <Row>
              <span>????????????</span>
              <span>{discountAmout.toLocaleString('ko-kr')} ???</span>
            </Row>
            <Row>
              <span>?????????</span>
              <span>{deliveryFee.toLocaleString('ko-kr')} ???</span>
            </Row>
            <Row>
              <span className="font-semibold">?????? ??????</span>
              <span className="font-semibold text-red-500">
                {(totalPrice + deliveryFee - discountAmout).toLocaleString(
                  'ko-kr'
                )}{' '}
                ???
              </span>
            </Row>

            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{ root: { height: 48 } }}
              onClick={handleOrder}
            >
              ????????????
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <p>????????????</p>
        {products && (
          <div className="grid grid-cols-3 gap-5">
            {products.map((item) => (
              <div
                key={item.id}
                style={{ maxWidth: 310 }}
                onClick={() => router.push(`/products/${item.id}`)}
              >
                <Image
                  className="rounded"
                  src={item.image_url as string}
                  alt={item.name}
                  width={300}
                  height={200}
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  style={{
                    cursor: 'pointer'
                  }}
                />
                <div className="flex">
                  <span>{item.name}</span>
                  <span className="ml-auto">
                    {item.price.toLocaleString('ko-KR')}???
                  </span>
                </div>
                <span className="text-zinc-400">
                  {CATEGORY_NAME[item.category_id - 1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
