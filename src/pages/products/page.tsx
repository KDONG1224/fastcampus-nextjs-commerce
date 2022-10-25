import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { products } from '@prisma/client';
import { Pagination } from '@mantine/core';

const TAKE_PAGE = 9;
const blurDataURL =
  'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==';

const Products = () => {
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<products[]>([]);

  useEffect(() => {
    // products
    fetch(`/api/get-products?skip=0&take=${TAKE_PAGE}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.items));

    // count
    fetch(`/api/get-products-count`)
      .then((res) => res.json())
      .then((data) => setTotal(Math.ceil(data.items / TAKE_PAGE)));
  }, []);

  useEffect(() => {
    // activePage
    const skip = TAKE_PAGE * (activePage - 1);

    fetch(`/api/get-products?skip=${skip}&take=${TAKE_PAGE}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.items));
  }, [activePage]);

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
      <div className="w-full flex mt-5">
        <Pagination
          className="m-auto"
          page={activePage}
          onChange={setPage}
          total={total}
        />
      </div>
    </div>
  );
};

export default Products;
