import * as React from 'react'
import { useEffect, useState } from 'react'
import { ChevronDown, Save, SquareX, Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import axios from 'axios';  

import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  modifiedAt: Date;
  _id: string;
  shop_name: string;
  p_image: string;
  v_sku: string;
  status: string;
  p_title: string;
  p_tags: string[];
  v_title: string;
  v_price: number;
  v_qty: number;
  updatedAt: Date;
  variants: any[];
  barcode_image_url?: string;
}

interface Variant {
  _id: string;
  title: string;
  sku: string;
  price: number;
  inventory_quantity: number;
  image_url?: string;
  barcode_image_url?: string;
}

interface TransformedProduct {
  id: string;
  shop: string;
  image: string;
  status: string;
  product: string;
  tag: string;
  variant: number;
  price: string;
  modifiedAt: Date;
  variants?: Variant[]; 
  createdAt: Date;
}

const transformApiData = (products: Product[]) => {
  return products.map((product) => ({
    id: product._id,
    shop: product.shop_name.charAt(0).toUpperCase() + product.shop_name.slice(1).toLowerCase(),
    image: product.p_image,
    barcode_image_url: product.barcode_image_url,
    status: product.status.charAt(0).toUpperCase() + product.status.slice(1).toLowerCase(),
    product: product.p_title,
    tag: product.p_tags.join(', ') || '-',
    variant: product.variants?.length || 0,
    price: `$${product.v_price}`,
    modifiedAt: product.updatedAt,
    createdAt: product.createdAt,
    variants: product.variants 
  }))
}


const tableHeaders = [
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
];



export function DataTable<TData, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [filters, setFilters] = React.useState({
    price: '',
    product: '',
    shop: '',
  })
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<TData | null>(
    null
  )
  const [editingRow, setEditingRow] = React.useState<number | null>(null)
  const [editedValues, setEditedValues] = React.useState<{
    sku: string
    price: number
    product: string
  }>({ sku: '', product: '', price: '' })
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  const [data, setData] = React.useState<TransformedProduct[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

    
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log('Making API request to:', 'https://22f2-49-36-91-136.ngrok-free.app/api/getProductData');
        const response = await axios.post('https://36a4-49-36-91-136.ngrok-free.app/api/getProductData', {}, {
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        console.log("Fetched API Data:", response.data);
        const transformedData = transformApiData(response.data.products || []);
        console.log("Transformed Data for Table:", transformedData);
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
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
        (filters.price === '' || priceNumeric <= Number(filters.price)) &&
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
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {tableHeaders.map((header, colIndex) => (
                  <TableCell key={colIndex} className='px-4 py-2 text-center'>
                    {header === 'shop' ? (
                      <div className='flex items-center gap-2'>
                        <span className='truncate text-sm font-medium '>
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
                      ) : (
                        row[header]
                      )
                    ) : header === 'price' ? (
                      editingRow === rowIndex ? (
                        <input
                          type='text'
                          className='w-full rounded border px-2 py-1 dark:bg-gray-900'
                          value={editedValues.price}
                          onChange={(e) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        row[header]
                      )
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
                                  price: editedValues.price,
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
                                  price: '',
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
                                  price: '',
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
                                price: row.price,
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
                        className='h-20 w-40 object-cover rounded '
                      />
                    ) : header === 'modified at' ? (
                      new Date(row.modifiedAt).toLocaleString()
                    ) : header === 'created at' ? (
                      new Date(row.createdAt).toLocaleString()
                    ) : header === 'product' ? (
                      editingRow === rowIndex ? (
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
                      ) : (
                        row[header.toLowerCase()] || '-'
                      )
                    ) : header === 'variant' ? (
                      <div
                        className='flex cursor-pointer items-center gap-2 text-center hover:text-blue-500'
                        onClick={() => {
                          setSelectedProduct(row)
                          setIsModalOpen(true)
                        }}
                      >
                        <span className='  text-center text-sm font-medium '>
                        {`${row[header]} `} </span>
                      </div>
                    ) : (
                      row[header] || '-'
                    )}
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
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
              .filter(page => 
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
        {console.log('Selected Product in Modal:', selectedProduct)}
        <div className='flex items-center justify-center gap-4'>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.product}
            className='h-40 w-60 object-cover rounded '
          />
          {selectedProduct.barcode_image_url && (
            <img
              src={selectedProduct.barcode_image_url}
              alt={`Barcode for ${selectedProduct.product}`}
              className='h-40 w-40 object-cover rounded'
            />
          )}
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <p className='font-semibold'>Shops:</p>
          <p>{selectedProduct.shop}</p>
          <p className='font-semibold'>Product:</p>
          <p>{selectedProduct.product}</p>
          <p className='font-semibold'>Status:</p>
          <p>{selectedProduct.status}</p>
          <p className='font-semibold'>Tag:</p>
          <p>{selectedProduct.tag}</p>
          <p className='font-semibold'>Total Variants:</p>
          <p>{selectedProduct.variant}</p>
          <p className='font-semibold'>Base Price:</p>
          <p>{selectedProduct.price}</p>
        </div>

        {selectedProduct.variants && selectedProduct.variants.length > 0 && (
          <div className='mt-4'>
            <h3 className='mb-3 text-lg font-semibold'>Variants</h3>
            <div className='grid gap-4'>
              {selectedProduct.variants.map((variant, index) => (
                <div key={variant._id} className='rounded-lg border p-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <h4 className='font-medium'>Title:{variant.title}</h4>
                      <h4 className='font-medium'>sku{variant.sku?variant.sku:' - '}</h4>
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
                          className='h-12 w-12 object-cover '
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


