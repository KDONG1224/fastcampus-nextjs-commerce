import { products } from '@prisma/client';
import { Button } from 'components';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

const TAKE_PAGE = 9;
const blurDataURL =
  'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==';

const Products = () => {
  const [skip, setSkip] = useState(0);
  const [products, setProducts] = useState<products[]>([]);

  const getProducts = useCallback(() => {
    const nextSkip = skip + TAKE_PAGE;

    fetch(`/api/get-products?skip=${nextSkip}&take=${TAKE_PAGE}`)
      .then((res) => res.json())
      .then((data) => {
        const list = products.concat(data.items);
        setProducts(list);
      });
    setSkip(nextSkip);
  }, [products, skip]);

  useEffect(() => {
    fetch(`/api/get-products?skip=0&take=${TAKE_PAGE}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.items));
  }, []);

  return (
    <div className="px-36 mt-36 mb-36">
      {products && (
        <div className="grid grid-cols-3 gap-5">
          {products.map((item) => (
            <div key={item.id}>
              <Image
                className="rounded"
                src={item.image_url as string}
                alt={item.name}
                width={300}
                height={200}
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
              <div className="flex">
                <span>{item.name}</span>
                <span className="ml-auto">
                  {item.price.toLocaleString('ko-KR')}원
                </span>
              </div>
              <span className="text-zinc-400">
                {item.category_id === 1 && '의류'}
              </span>
            </div>
          ))}
        </div>
      )}
      <Button
        className="w-full rounded mt-20 bg-zinc-200 p-4"
        onClick={getProducts}
      >
        더보기
      </Button>
    </div>
  );
};

export default Products;
