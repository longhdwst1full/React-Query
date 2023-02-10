import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'apis/students.api'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// import { Students as StudentType } from 'types/students.type'
import { useQueryString } from 'utils/untils'
import classNames from 'classnames'
import { toast } from 'react-toastify'
const LIMIT = 10

export default function Students() {
  // const [students, setStudents] = useState<StudentType>([])
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudents(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])
  //
  const queryClient = useQueryClient()
  const querySting = useQueryString()
  const page = Number(querySting.page) || 1

  // const { data, isLoading } = useQuery({
  const studentQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return getStudents(page, LIMIT, controller.signal)
    },
    keepPreviousData: true,
    retry: 1
  })

  const totalStudentCount = Number(studentQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentCount / LIMIT)

  const handleRefetchStudent = (id: number) => {
    queryClient.prefetchQuery(['student', String(id)], {
      queryFn: () => getStudent(id),
      staleTime: 1000 * 10
    })
  }

  const fetchStudent = (second: number) => {
    const id = '6'
    queryClient.prefetchQuery(['student', id], {
      queryFn: () => getStudent(id),
      staleTime: second * 1000
    })
  }

  // delete item
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => deleteStudent(id),
    onSuccess: (_, id) => {
      toast.success(`Xóa thành công Student với id là ${id} `)
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
    }
  })
  const handleDelete = (id: number) => {
    deleteStudentMutation.mutate(id)
  }

  const refetchStudents = () => {
    studentQuery.refetch()
  }

  const cancelRefetchStudents = () => {
    queryClient.cancelQueries({
      queryKey: ['students', page]
    })
  }
  return (
    <div>
      <h1 className='text-lg'>Students</h1>

      <div>
        <button className='mt-6 rounded bg-blue-500 px-5 py-2 text-white' onClick={() => fetchStudent(10)}>
          Click 10s
        </button>

        <button className='mt-6 rounded bg-blue-500 px-5 py-2 text-white' onClick={() => fetchStudent(2)}>
          Click 3s
        </button>
      </div>

      <div>
        <button className='mt-6 rounded bg-pink-500 px-5 py-2 text-white' onClick={refetchStudents}>
          Refetch Student
        </button>
      </div>

      <div>
        <button className='mt-6 rounded bg-pink-500 px-5 py-2 text-white' onClick={cancelRefetchStudents}>
          Cancel Refetch Student
        </button>
      </div>

      <div className='mt-6'>
        <Link
          to='/students/add'
          type='button'
          className='rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Add student
        </Link>
      </div>
      {studentQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2/.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!studentQuery.isLoading && (
        <Fragment>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentQuery.data?.data.map((student) => (
                  <tr
                    onMouseEnter={() => handleRefetchStudent(student.id)}
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                  >
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link to={`/students/${student.id}`} className='mr-5 font-medium text-blue-600 hover:underline'>
                        Edit
                      </Link>
                      <button className='font-medium text-red-600' onClick={() => handleDelete(student.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                      {' '}
                      Previous
                    </span>
                  ) : (
                    <Link
                      className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      to={`/students?page=${page - 1}`}
                    >
                      Previous
                    </Link>
                  )}
                </li>

                {Array(totalPage)
                  .fill(0)
                  .map((item, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber

                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            'border border-gray-300 py-2 px-3 leading-tight  hover:bg-gray-100  hover:text-gray-700',
                            {
                              'bg-gray-100 text-gray-700': isActive,
                              'bg-white text-gray-500 ': !isActive
                            }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === totalPage ? (
                    <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                      Next
                    </span>
                  ) : (
                    <Link
                      className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      to={`/students?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
  )
}
