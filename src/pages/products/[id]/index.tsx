import React, { useState } from 'react';
import Image from 'next/image';
import Carousel from 'nuka-carousel';

import { CommnetItem, Count, CustomEditor } from 'components';
import { useRouter } from 'next/router';
import { convertFromRaw, EditorState } from 'draft-js';

import { GetServerSideProps } from 'next';
import { Cart, Comment, OrderItem, products } from '@prisma/client';
import { format } from 'date-fns';
import {
  CART_QUERY_KEY,
  CATEGORY_NAME,
  ORDERITEM_QUERY_KEY,
  WISHLIST_QUETY_KEY
} from 'const';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@mantine/core';
import { IconHeart, IconHeartbeat, IconShoppingCart } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export interface CommentItemType extends Comment, OrderItem {}
interface ProductsV2DetailProps {
  product: products & { images: string[] };
  comments: CommentItemType[];
}

const ProductsV2Detail: React.FC<ProductsV2DetailProps> = ({
  product,
  comments
}) => {
  const { data: session } = useSession();

  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState<number | undefined>(1);
  const [editorState] = useState<EditorState | undefined>(() =>
    product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(product.contents))
        )
      : EditorState.createEmpty()
  );

  const router = useRouter();
  const { id: productId } = router.query;

  const queryClient = useQueryClient();

  const { data: wishlist } = useQuery([WISHLIST_QUETY_KEY], () =>
    fetch(WISHLIST_QUETY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  );

  const { mutate } = useMutation<unknown, unknown, string, any>(
    (pid) =>
      fetch('/api/update-wishlist', {
        method: 'POST',
        body: JSON.stringify({ pid })
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (pid) => {
        await queryClient.cancelQueries([WISHLIST_QUETY_KEY]);

        const prev = queryClient.getQueryData([WISHLIST_QUETY_KEY]);

        queryClient.setQueryData<string[]>([WISHLIST_QUETY_KEY], (prod) =>
          prod
            ? prod.includes(String(pid))
              ? prod.filter((id) => id !== String(pid))
              : prod.concat(String(pid))
            : []
        );

        return prev;
      },
      onSuccess: () => {
        queryClient.invalidateQueries([WISHLIST_QUETY_KEY]);
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([WISHLIST_QUETY_KEY], context.prev);
      }
    }
  );

  const { mutate: addCartItem } = useMutation<
    unknown,
    unknown,
    Omit<Cart, 'id' | 'userId'>,
    any
  >(
    (cartItem) =>
      fetch('/api/add-cart', {
        method: 'POST',
        body: JSON.stringify({ cartItem })
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([ORDERITEM_QUERY_KEY]);
      },
      onSuccess: () => {
        router.push('/cart');
      }
    }
  );

  const { mutate: addOrder } = useMutation<
    unknown,
    unknown,
    Omit<OrderItem, 'id'>[],
    any
  >(
    (items) =>
      fetch('/api/add-order', {
        method: 'POST',
        body: JSON.stringify({ items })
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onSuccess: () => {
        router.push('/my');
      }
    }
  );

  const validate = (type: 'cart' | 'order') => {
    if (quantity == null) {
      alert('?????? ????????? ???????????????.');
      return;
    }

    if (type === 'cart') {
      addCartItem({
        productId: product.id,
        quantity: quantity,
        amount: product.price * quantity
      });
    }

    if (type === 'order') {
      addOrder([
        {
          productId: product.id,
          quantity: quantity,
          price: product.price,
          amount: product.price * quantity
        }
      ]);
    }
  };

  const isWished =
    wishlist && productId ? wishlist.indexOf(String(productId)) > -1 : false;

  return (
    <>
      {product !== null && productId !== null ? (
        <div className="flex flex-row">
          <Head>
            <title>Kdong-Commerce {product.name}</title>
            <meta
              name="description"
              content="Fastcampus Kdong Commerce Service"
            />
          </Head>
          <div style={{ maxWidth: 600, marginRight: 52 }}>
            <Carousel
              animation="fade"
              // autoplay
              withoutControls
              wrapAround
              speed={10}
              slideIndex={index}
            >
              {product.images.map((url, i) => (
                <Image
                  key={`${url}-carousel-${i}`}
                  src={url}
                  alt={url}
                  width={600}
                  height={600}
                  layout="responsive"
                />
              ))}
            </Carousel>
            <div className="flex space-x-4 mt-2">
              {product.images.map((url, idx) => (
                <div key={`${url}-thumb-${idx}`} onClick={() => setIndex(idx)}>
                  <Image src={url} alt="image" width={100} height={100} />
                </div>
              ))}
            </div>
            {editorState != null && (
              <CustomEditor editorState={editorState} readOnly />
            )}

            <div>
              <p className="text-2xl font-semibold mb-2">??????</p>
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <CommnetItem key={idx} comment={comment} />
                ))
              ) : (
                <div className="text-sm text-zinc-400">????????? ????????????.</div>
              )}
            </div>
          </div>
          <div
            className="flex flex-col space-y-6"
            style={{
              maxWidth: 600
            }}
          >
            {/* ???????????? */}
            <div className="text-lg text-zinc-400">
              {CATEGORY_NAME[product.category_id - 1]}
            </div>

            {/* ???????????? */}
            <div className="text-4xl font-semibold">{product.name}</div>

            {/* ?????? */}
            <div className="text-lg">
              {product.price.toLocaleString('ko-kr')}???
            </div>

            {/* ?????? */}
            <div className="">
              <span className="text-lg">??????</span>
              <Count value={quantity} setValue={setQuantity} max={200} />
            </div>

            {/* ????????????, ????????? ?????? */}
            <div className="flex space-x-3">
              <Button
                leftIcon={<IconShoppingCart size={20} stroke={1.5} />}
                style={{ backgroundColor: 'black' }}
                radius="xl"
                size="md"
                styles={{
                  root: {
                    paddingRight: 14,
                    height: 48
                  }
                }}
                onClick={() => {
                  if (session == null) {
                    alert('???????????? ????????????');
                    router.push('/auth/login');
                    return;
                  }
                  validate('cart');
                }}
              >
                ????????????
              </Button>
              <Button
                // loading={isLoading}
                disabled={wishlist == null}
                leftIcon={
                  isWished ? (
                    <IconHeart size={20} stroke={1.5} />
                  ) : (
                    <IconHeartbeat size={20} stroke={1.5} />
                  )
                }
                style={{ backgroundColor: isWished ? 'red' : 'grey' }}
                radius="xl"
                size="md"
                styles={{
                  root: {
                    paddingRight: 14,
                    height: 48
                  }
                }}
                onClick={() => {
                  if (session == null) {
                    alert('???????????? ????????????');
                    router.push('/auth/login');
                    return;
                  }

                  mutate(String(productId));
                }}
              >
                ?????????
              </Button>
            </div>

            {/* ???????????? */}
            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{
                root: {
                  paddingRight: 14,
                  height: 48
                }
              }}
              onClick={() => {
                if (session == null) {
                  alert('???????????? ????????????');
                  router.push('/auth/login');
                  return;
                }
                validate('order');
              }}
            >
              ????????????
            </Button>

            {/* ???????????? */}
            <div className="text-sm text-zinc-300">
              ???????????? : {format(new Date(product.createdAt), 'yyyy??? M??? d???')}
            </div>
          </div>
        </div>
      ) : (
        <div>?????????...</div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const product = await fetch(
    `${process.env.NEXTAUTH_URL}/api/get-product?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.items);

  const comments = await fetch(
    `${process.env.NEXTAUTH_URL}/api/get-comments?productId=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.items);

  console.log('== comments == : ', comments);

  return {
    props: {
      product: { ...product, images: [product.image_url, product.image_url] },
      comments: comments
    }
  };
};

export default ProductsV2Detail;
