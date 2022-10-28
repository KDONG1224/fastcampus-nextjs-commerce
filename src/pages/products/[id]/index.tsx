import React, { useState } from 'react';
import Image from 'next/image';
import Carousel from 'nuka-carousel';

import { Count, CustomEditor } from 'components';
import { useRouter } from 'next/router';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';

import { GetServerSideProps } from 'next';
import { products } from '@prisma/client';
import { format } from 'date-fns';
import { CATEGORY_NAME } from 'const';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { Button } from '@mantine/core';
import { IconHeart, IconHeartbeat, IconShoppingCart } from '@tabler/icons';
import { useSession } from 'next-auth/react';

interface ProductsV2DetailProps {
  product: products & { images: string[] };
}

const WISHLIST_QUETY_KEY = '/api/get-wishlist';

const ProductsV2Detail: React.FC<ProductsV2DetailProps> = ({ product }) => {
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

  const { mutate, isLoading } = useMutation<unknown, unknown, string, any>(
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
      onError: (error, _, context) => {
        queryClient.setQueryData([WISHLIST_QUETY_KEY], context.prev);
      }
    }
  );

  const validate = (type: 'cart' | 'order') => {
    if (quantity == null) {
      alert('최소 수량을 선택하세요.');
      return;
    }

    router.push('/cart');
  };

  const isWished =
    wishlist && productId ? wishlist.indexOf(String(productId)) > -1 : false;

  return (
    <>
      {product !== null && productId !== null ? (
        <div className="flex flex-row">
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
          </div>
          <div
            className="flex flex-col space-y-6"
            style={{
              maxWidth: 600
            }}
          >
            {/* 카테고리 */}
            <div className="text-lg text-zinc-400">
              {CATEGORY_NAME[product.category_id - 1]}
            </div>

            {/* 상품이름 */}
            <div className="text-4xl font-semibold">{product.name}</div>

            {/* 가격 */}
            <div className="text-lg">
              {product.price.toLocaleString('ko-kr')}원
            </div>

            {/* 수량 */}
            <div className="">
              <span className="text-lg">수량</span>
              <Count value={quantity} setValue={setQuantity} max={200} />
            </div>

            {/* 장바구니, 찜하기 버튼 */}
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
                    alert('로그인이 필요해요');
                    router.push('/auth/login');
                    return;
                  }
                  validate('cart');
                }}
              >
                장바구니
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
                    alert('로그인이 필요해요');
                    router.push('/auth/login');
                    return;
                  }

                  mutate(String(productId));
                }}
              >
                찜하기
              </Button>
            </div>

            {/* 등록일자 */}
            <div className="text-sm text-zinc-300">
              등록일자 : {format(new Date(product.createdAt), 'yyyy년 M월 d일')}
            </div>
          </div>
        </div>
      ) : (
        <div>로딩중...</div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const product = await fetch(
    `http://localhost:3000/api/get-product?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.items);

  return {
    props: {
      product: { ...product, images: [product.image_url, product.image_url] }
    }
  };
};

export default ProductsV2Detail;
