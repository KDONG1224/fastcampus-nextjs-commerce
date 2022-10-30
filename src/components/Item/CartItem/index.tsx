import { Cart } from '@prisma/client';
import { IconRefresh, IconX } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Count } from 'components';
import { CART_QUERY_KEY } from 'const';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CartItemProps } from 'pages/cart';
import React, { useEffect, useState } from 'react';

interface ItemProps {
  cart: CartItemProps;
}

export const CartItem: React.FC<ItemProps> = ({ cart }) => {
  const { name, productId, price, quantity: quan, amount, image_url } = cart;

  const [quantity, setQuantity] = useState<number | undefined>(quan);
  const [total, setTotal] = useState<number>(quantity as number);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateCart } = useMutation<unknown, unknown, Cart, any>(
    (item) =>
      fetch('/api/update-cart', {
        method: 'POST',
        body: JSON.stringify({ item })
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (item) => {
        await queryClient.cancelQueries([CART_QUERY_KEY]);

        const prev = queryClient.getQueryData([CART_QUERY_KEY]);

        queryClient.setQueryData<Cart[]>([CART_QUERY_KEY], (cart) =>
          cart?.filter((c) => c.id !== item.id).concat(item)
        );

        return prev;
      },
      onSuccess: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([CART_QUERY_KEY], context.prev);
      }
    }
  );

  const { mutate: deleteCart } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch('/api/delete-cart', {
        method: 'POST',
        body: JSON.stringify({ id })
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries([CART_QUERY_KEY]);

        const prev = queryClient.getQueryData([CART_QUERY_KEY]);

        queryClient.setQueryData<Cart[]>([CART_QUERY_KEY], (cart) =>
          cart?.filter((c) => c.id !== id)
        );

        return prev;
      },
      onSuccess: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([CART_QUERY_KEY], context.prev);
      }
    }
  );

  const handleUpdate = () => {
    if (quantity == null) {
      alert('최소 수량을 선택해주세요.');
      return;
    }

    updateCart({
      ...cart,
      quantity: quantity,
      amount: cart.price * quantity
    });
  };

  const handleDelete = async () => {
    alert('해당 상품이 삭제 되었습니다.');
    await deleteCart(cart.id);
  };

  const handleMoveRouter = () => {
    router.push(`/products/${productId}`);
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
        onClick={handleMoveRouter}
        style={{
          cursor: 'pointer'
        }}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{name}</span>
        <span className="mb-auto">
          가격 : {price.toLocaleString('ko-kr')}원
        </span>
        <div className="flex items-center space-x-4">
          <Count value={quantity} setValue={setQuantity} />
          <IconRefresh
            onClick={handleUpdate}
            style={{
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>합계 : {total.toLocaleString('ko-kr')}원</span>
        <IconX
          onClick={handleDelete}
          style={{
            cursor: 'pointer'
          }}
        />
      </div>
    </div>
  );
};
