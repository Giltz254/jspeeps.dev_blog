import { DataTable } from '@/components/custom/admin/BlogTable'
const page = async () => {
  return (
    <div className='min-h-[calc(100vh-64px)] w-full bg-white font-[family-name:var(--font-lora)]'>
      <div className='flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]'>
        <div className='flex lg:w-3/4 lg:pr-4 w-full flex-col lg:border-r py-10'>
          <DataTable />
        </div>
        <div className='lg:w-1/4 w-full'></div>
      </div>
    </div>
  )
}

export default page
