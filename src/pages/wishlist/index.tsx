import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { blurDataURL, CATEGORY_NAME } from 'const';
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import { products } from '@prisma/client';

const WishList = () => {
  const router = useRouter();

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    [`/api/get-wishlists`],
    () => fetch(`/api/get-wishlists`).then((res) => res.json()),
    {
      select: (data) => data.items
    }
  );

  const handleMoveDetail = (id: string) => {
    router.push(`/products/${id}`);
  };
  return (
    <div>
      <p className="text-2xl mb-4">내가 찜한 상품</p>
      {products && (
        <div className="grid grid-cols-3 gap-5">
          {products.map((item) => (
            <div
              key={item.id}
              style={{ maxWidth: 310 }}
              onClick={() => handleMoveDetail(String(item.id))}
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
                  {item.price.toLocaleString('ko-KR')}원
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
  );
};

export default WishList;
