import * as React from 'react'
import axios from 'axios'
// import { useEffect, useState } from 'react'
import { Save, SquareX, Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  createdAt: Date
  modifiedAt: Date
  _id: string
  shop_name: string
  p_image: string
  v_sku: string
  status: string
  p_title: string
  p_tags: string[]
  v_title: string
  v_price: number
  v_qty: number
  updatedAt: Date
  variants: Variant[];
  barcode_image_url?: string
}

interface Variant {
  _id: string
  title: string
  sku: string
  price: number
  inventory_quantity: number
  image_url?: string
  barcode_image_url?: string
}

interface TransformedProduct {
  [key: string]: string | number | Date | Variant[] | undefined; 
  id: string
  shop: string
  image: string
  status: string
  product: string
  tag: string
  variant: number
  price: string
  modifiedAt: Date
  createdAt: Date
  sku: string
  barcode_image_url?: string
  variants: Variant[]
}

const transformApiData = (products: Product[]) => {
  return products.map((product) => ({
    id: product._id,
    shop:
      product.shop_name.charAt(0).toUpperCase() +
      product.shop_name.slice(1).toLowerCase(),
    image: product.p_image,
    barcode_image_url: product.barcode_image_url,
    status:
      product.status.charAt(0).toUpperCase() +
      product.status.slice(1).toLowerCase(),
    product: product.p_title,
    tag: product.p_tags.join(', ') || '-',
    variant: product.variants?.length || 0,
    price: `$${product.v_price}`,
    modifiedAt: product.updatedAt,
    createdAt: product.createdAt,
    variants: product.variants || [],
    sku: product.v_sku || '-',
  }))
}
type TransformedProductKey = keyof TransformedProduct

const tableHeaders: (TransformedProductKey | 'action')[] = [
  'shop',
  'image',
  'status',
  'product',
  'tag',
  'variant',
  'price',
  'modifiedAt',
  'createdAt',
  'action',
] as const

export function DataTable() {
  const [filters, setFilters] = React.useState({
    price: 0,
    product: '',
    shop: '',
  })
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] =
    React.useState<TransformedProduct | null>(null)
  const [editingRow, setEditingRow] = React.useState<number | null>(null)
  const [editedValues, setEditedValues] = React.useState<{
    sku: string
    price: number
    product: string
  }>({ sku: '', product: '', price: 0 })
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  const [data, setData] = React.useState<TransformedProduct[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Making API request to:', 'https://5795-49-36-91-136.ngrok-free.app/api/getProductData');
        
        const response = await axios.post(
          'https://5795-49-36-91-136.ngrok-free.app/api/getProductData',
          {},
          {
            headers: {
              Accept: 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          }
        );
  
        // console.log('Fetched API Data:', response.data);
        const transformedData = transformApiData(response.data.products || []);
        // console.log('Transformed Data for Table:', transformedData);
        setData(transformedData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false); 
      }
    };
  
    fetchData();
  }, []); 
  

  const filteredData = React.useMemo(() => {
    return data.filter((item: TransformedProduct) => {
      const priceNumeric = parseFloat(item.price.replace('$', ''))
      return (
        (filters.price === 0 || priceNumeric <= filters.price) &&
        (filters.product === '' ||
          item.product.toLowerCase().includes(filters.product.toLowerCase())) &&
        (filters.shop === '' ||
          item.shop.toLowerCase().includes(filters.shop.toLowerCase()))
      )
    })
  }, [data, filters])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setCurrentPage(1)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading data...</div>

  return (
    <div className='space-y-4'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          type='text'
          name='shop'
          placeholder='Filter by shop...'
          value={filters.shop}
          onChange={handleFilterChange}
          className='w-full sm:w-[200px]'
        />
        <Input
          type='text'
          name='product'
          placeholder='Filter by product...'
          value={filters.product}
          onChange={handleFilterChange}
          className='w-full sm:w-[200px]'
        />
        <Input
          type='number'
          name='price'
          placeholder='Max price...'
          value={filters.price}
          onChange={handleFilterChange}
          className='w-full sm:w-[150px]'
        />
      </div>

      <div className='rounded-md border'>
        <Table className='overflow-hidden rounded-lg border border-gray-300 shadow-md'>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className='px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider dark:bg-gray-900'
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {/* <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {tableHeaders.map((header, colIndex) => (
                  <TableCell key={colIndex} className='px-4 py-2 text-center'>
                    {header === 'shop' ? (
                      <div className='flex items-center gap-2'>
                        <span className='truncate text-sm font-medium'>
                          {header === 'shop' ? row.shop : row[header]}
                        </span>
                      </div>
                    ) : header === 'sku' ? (
                      editingRow === rowIndex ? (
                        <input
                          type='text'
                          className='w-full rounded border px-2 py-1 dark:bg-gray-900'
                          value={editedValues.sku}
                          onChange={(e) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              sku: e.target.value,
                            }))
                          }
                        />
                      ) : row[header as keyof TransformedProduct] instanceof
                        Date ? (
                        new Date(
                          row[header as keyof TransformedProduct] as string
                        ).toLocaleDateString()
                      ) : (
                        (row[
                          header as keyof TransformedProduct
                        ]?.toLocaleString() ?? '-')
                      )
                    ) : header === 'price' ? (
                      editingRow === rowIndex ? (
                        <input
                          type='text'
                          className='w-full rounded border px-2 py-1 dark:bg-gray-900'
                          value={editedValues.price.toString()}
                          onChange={(e) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              price: parseFloat(e.target.value),
                            }))
                          }
                        />
                      ) : (
                        (row[
                          header as keyof TransformedProduct
                        ]?.toLocaleString() ?? '-')
                      )
                    ) : null}
                    ) : header === 'action' ? (
                    <div className='flex justify-center space-x-2'>
                      {editingRow === rowIndex ? (
                        <>
                          <button
                            className='text-green-600 hover:text-green-800'
                            onClick={() => {
                              const updatedRow = {
                                ...filteredData[rowIndex],
                                sku: editedValues.sku,
                                price: editedValues.price.toString(),
                                product: editedValues.product,
                              }

                              console.log('Saving changes:', updatedRow)

                              const updatedData = filteredData.map(
                                (item, index) =>
                                  index === rowIndex ? updatedRow : item
                              )
                              setData(updatedData)

                              setEditingRow(null)
                              setEditedValues({
                                sku: '',
                                price: 0,
                                product: '',
                              })
                            }}
                          >
                            <Save />
                          </button>
                          <button
                            className='text-red-600 hover:text-red-800'
                            onClick={() => {
                              setEditingRow(null)
                              setEditedValues({
                                sku: '',
                                price: 0,
                                product: '',
                              })
                            }}
                          >
                            <SquareX />
                          </button>
                        </>
                      ) : (
                        <Pencil
                          className='h-5 w-5 cursor-pointer hover:text-blue-500'
                          onClick={() => {
                            setEditingRow(rowIndex)
                            setEditedValues({
                              sku: row.sku,
                              price: parseFloat(row.price.replace('$', '')),
                              product: row.product,
                            })
                          }}
                        />
                      )}
                    </div>
                    ) : header === 'image' ? (
                    <img
                      src={row.image}
                      alt={row.product}
                      className='h-20 w-40 rounded object-cover'
                    />
                    ) : header.replace(/\s+/g, '').toLowerCase() ===
                    'modifiedat' ? ( new Date(row.modifiedAt).toLocaleString() )
                    : header.replace(/\s+/g, '').toLowerCase() === 'createdat' ?
                    ( new Date(row.createdAt).toLocaleString() ) : header ===
                    'product' ? ( editingRow === rowIndex ? (
                    <input
                      type='text'
                      className='w-full rounded border px-2 py-1'
                      value={editedValues.product}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          product: e.target.value,
                        }))
                      }
                    />
                    ) : ( row[header as keyof TransformedProduct] || '-' ) ) :
                    header === 'variant' ? (
                    <div
                      className='flex cursor-pointer items-center gap-2 text-center hover:text-blue-500'
                      onClick={() => {
                        setSelectedProduct(row)
                        setIsModalOpen(true)
                      }}
                    >
                      <span className='text-center text-sm font-medium'>
                        {header in row
                          ? `${row[header as keyof TransformedProduct]}`
                          : '-'}
                      </span>
                    </div>
                    ) : ( row[header] || '-' )
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody> */}

<TableBody>
  {paginatedData.map((row, rowIndex) => (
    <TableRow key={rowIndex}>
      {tableHeaders.map((header, colIndex) => (
//         <TableCell key={colIndex} className='px-4 py-2 text-center'>
//           {header === 'shop' ? (
//             <div className='flex items-center gap-2'>
//               <span className='truncate text-sm font-medium text-gray-700'>
//                 {row.shop}
//               </span>
//             </div>
//           ) : header === 'sku' ? (
//             editingRow === rowIndex ? (
//               <input
//                 type='text'
//                 className='w-full rounded border px-2 py-1 dark:bg-gray-900'
//                 value={editedValues.sku}
//                 onChange={(e) =>
//                   setEditedValues((prev) => ({ ...prev, sku: e.target.value }))
//                 }
//               />
//             ) : (
//               row.sku || '-'
//             )
//           ) : header === 'price' ? (
//             editingRow === rowIndex ? (
//               <input
//                 type='text'
//                 className='w-full rounded border px-2 py-1 dark:bg-gray-900'
//                 value={editedValues.price}
//                 onChange={(e) =>
//                   setEditedValues((prev) => ({ ...prev, price: parseFloat(e.target.value) }))
//                 }
//               />
//             ) : (
//               row.price || '-'
//             )
//           ) : header === 'action' ? (
//             <div className='flex justify-center space-x-2'>
//               {editingRow === rowIndex ? (
//                 <>
//                   <button
//   className='text-green-600 hover:text-green-800'
//   onClick={() => {
//     const updatedRow = {
//       ...filteredData[rowIndex],
//       sku: editedValues.sku,
//       price: String(editedValues.price), 
//       product: editedValues.product,
//     };
//     const updatedData = filteredData.map((item, index) =>
//       index === rowIndex ? updatedRow : item
//     );
//     setData(updatedData);
//     setEditingRow(null);
//     setEditedValues({ sku: '', price: '', product: '' });
//   }}
// >
// <Save />

// </button>
//                   <button
//                     className='text-red-600 hover:text-red-800'
//                     onClick={() => {
//                       setEditingRow(null);
//                       setEditedValues({ sku: '', price: '', product: '' });
//                     }}
//                   >
//                     <SquareX />
//                   </button>
//                 </>
//               ) : (
//                 <Pencil
//                   className='h-5 w-5 cursor-pointer hover:text-blue-500'
//                   onClick={() => {
//                     setEditingRow(rowIndex);
//                     setEditedValues({
//                       sku: row.sku,
//                       price: row.price,
//                       product: row.product,
//                     });
//                   }}
//                 />
//               )}
//             </div>
//           ) : header === 'image' ? (
//             <img
//               src={row.image}
//               alt={row.product}
//               className='h-20 w-40 object-cover rounded'
//             />
//           ) : header === 'modifiedAt' ? (
//             new Date(row.modifiedAt).toLocaleString()
//           ) : header === 'createdAt' ? (
//             new Date(row.createdAt).toLocaleString()
//           ) : header === 'product' ? (
//             editingRow === rowIndex ? (
//               <input
//                 type='text'
//                 className='w-full rounded border px-2 py-1'
//                 value={editedValues.product}
//                 onChange={(e) =>
//                   setEditedValues((prev) => ({ ...prev, product: e.target.value }))
//                 }
//               />
//             ) : (
//               row.product || '-'
//             )
//           ) : header === 'variant' ? (
//             <div
//               className='flex cursor-pointer items-center gap-2 text-center hover:text-blue-500'
//               onClick={() => {
//                 setSelectedProduct(row);
//                 setIsModalOpen(true);
//               }}
//             >
//               <span className='text-center text-sm font-medium'>{row.variant || '-'}</span>
//             </div>
//           ) : (
//             {
//               typeof row[String(header).toLowerCase() as keyof TransformedProduct] === 'object' &&
//               row[String(header).toLowerCase() as keyof TransformedProduct] instanceof Date
//                 ? (row[String(header).toLowerCase() as keyof TransformedProduct] as Date).toLocaleString()
//                 : row[String(header).toLowerCase() as keyof TransformedProduct] || '-'
//             }
//                       )}
//         </TableCell>


<TableCell key={colIndex} className="px-4 py-2 text-center">
  {(() => {
    const key = String(header).toLowerCase() as keyof TransformedProduct;
    const value = row[key];

    if (header === "shop") {
      return (
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-gray-700">{String(value)}</span>
        </div>
      );
    }

    if (header === "sku") {
      return editingRow === rowIndex ? (
        <input
          type="text"
          className="w-full rounded border px-2 py-1 dark:bg-gray-900"
          value={editedValues.sku}
          onChange={(e) =>
            setEditedValues((prev) => ({ ...prev, sku: e.target.value }))
          }
        />
      ) : (
        String(value) || "-"
      );
    }

    if (header === "price") {
      return editingRow === rowIndex ? (
        <input
          type="text"
          className="w-full rounded border px-2 py-1 dark:bg-gray-900"
          value={editedValues.price}
          onChange={(e) =>
            setEditedValues((prev) => ({ ...prev, price: parseFloat(e.target.value) }))
          }
        />
      ) : (
        String(value) || "-"
      );
    }

    if (header === "action") {
      return (
        <div className="flex justify-center space-x-2">
          {editingRow === rowIndex ? (
            <>
              <button
  className="text-green-600 hover:text-green-800"
  onClick={() => {
    const updatedRow = {
      ...filteredData[rowIndex],
      sku: editedValues.sku,
      price: Number(editedValues.price).toString(), // Convert price back to a string
      product: editedValues.product,
    };
    const updatedData = filteredData.map((item, index) =>
      index === rowIndex ? updatedRow : item
    );
    setData(updatedData);
    setEditingRow(null);
    setEditedValues({ sku: "", price: 0, product: "" }); 
  }}
>
  <Save />
</button>

              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => {
                  setEditingRow(null);
                  setEditedValues({ sku: "", price: 0, product: "" });
                }}
              >
                <SquareX />
              </button>
            </>
          ) : (
            <Pencil
              className="h-5 w-5 cursor-pointer hover:text-blue-500"
              onClick={() => {
                setEditingRow(rowIndex);
                setEditedValues({
                  sku: row.sku,
                  price: Number(row.price), 
                  product: row.product,
                });
              }}
            />
          )}
        </div>
      );
    }

    if (header === "image") {
      return typeof value === "string" ? (
        <img
          src={value}
          alt={row.product}
          className="h-20 w-40 object-cover rounded"
        />
      ) : (
        "-"
      );
    }

    if (header === "modifiedAt" || header === "createdAt") {
      return value instanceof Date ? value.toLocaleString() : "-";
    }

    if (header === "product") {
      return editingRow === rowIndex ? (
        <input
          type="text"
          className="w-full rounded border px-2 py-1"
          value={editedValues.product}
          onChange={(e) =>
            setEditedValues((prev) => ({ ...prev, product: e.target.value }))
          }
        />
      ) : (
        String(value) || "-"
      );
    }

    if (header === "variant") {
      return (
        <div
          className="flex cursor-pointer items-center gap-2 text-center hover:text-blue-500"
          onClick={() => {
            setSelectedProduct(row);
            setIsModalOpen(true);
          }}
        >
          <span className="text-center text-sm font-medium">{String(value) || "-"}</span>
        </div>
      );
    }

    return typeof value === "object" && value !== null
      ? JSON.stringify(value) 
      : String(value) || "-";
  })()}
</TableCell>

      ))}
    </TableRow>
  ))}
</TableBody>


        </Table>

        {/* Pagination controls */}
        <div className='flex items-center justify-between border-t p-4'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-700'>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
              {filteredData.length} results
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='rounded border px-3 py-1 text-sm disabled:opacity-50'
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className='px-2'>...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`rounded px-3 py-1 text-sm ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className='rounded border px-3 py-1 text-sm disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className='grid gap-4'>
                <div className='flex items-center justify-center gap-4'>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.product}
                    className='h-40 w-60 rounded object-cover'
                  />
                  {selectedProduct.barcode_image_url && (
                    <img
                      src={selectedProduct.barcode_image_url}
                      alt={`Barcode for ${selectedProduct.product}`}
                      className='h-40 w-40 rounded object-cover'
                    />
                  )}
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <p className='font-semibold'>Shops:</p>
                  <p>{selectedProduct.shop}</p>
                  <p className='font-semibold'>Product:</p>
                  <p>{selectedProduct.product}</p>
                  <p className='font-semibold'>Status:</p>
                  <p>{(selectedProduct as TransformedProduct).status}</p>
                  <p className='font-semibold'>Tag:</p>
                  <p>{(selectedProduct as TransformedProduct).tag}</p>
                  <p className='font-semibold'>Total Variants:</p>
                  <p>{selectedProduct.variants?.length || 0}</p>
                  <p className='font-semibold'>Base Price:</p>
                  <p>{(selectedProduct as TransformedProduct).price}</p>
                </div>

                {selectedProduct.variants &&
                  selectedProduct.variants.length > 0 && (
                    <div className='mt-4'>
                      <h3 className='mb-3 text-lg font-semibold'>Variants</h3>
                      <div className='grid gap-4'>
                        {selectedProduct.variants.map((variant: Variant) => (
                          <div
                            key={variant._id}
                            className='rounded-lg border p-4'
                          >
                            <div className='grid grid-cols-2 gap-4'>
                              <div>
                                <h4 className='font-medium'>
                                  Title:{variant.title}
                                </h4>
                                <h4 className='font-medium'>
                                  sku{variant.sku ? variant.sku : ' - '}
                                </h4>
                                <p className='text-sm text-gray-600'>
                                  Price: ${variant.price}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  Quantity: {variant.inventory_quantity}
                                </p>
                              </div>
                              <div className='flex flex-col items-end gap-2'>
                                {variant.image_url && (
                                  <img
                                    src={variant.image_url}
                                    alt={variant.title}
                                    className='h-15 w-15 rounded-full object-cover'
                                  />
                                )}
                                {variant.barcode_image_url && (
                                  <img
                                    src={variant.barcode_image_url}
                                    alt={`Barcode for ${variant.title}`}
                                    className='h-12 w-12 object-cover'
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
