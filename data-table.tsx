import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const fetchData = async () => {
  try {
    const response = await fetch('https://547d-49-36-91-136.ngrok-free.app/api/getProductData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) 
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}; 

export function DataTable<TData, TValue>() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<any[]>([])

  return (
    <>
      {/* ... existing table code ... */}
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Variants</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            {selectedVariants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{variant.name}</span>
                <span>{variant.price}</span>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
} 