import React,{useCallback} from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from "react-router-dom";

function ErrorFour() {

  const navigate = useNavigate();
  const handleGoBack = useCallback(() => {
    navigate("/feedhome");
  }, [navigate]);
  
  return (
    <div className="py-10">
      <div className="text-center">
        <p className="text-base font-semibold text-black">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Sorry, we couldnot  find the page you are looking for.
        </p>
        <div className="mt-4 flex items-center justify-center gap-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            onClick={handleGoBack}
          >
            <ArrowLeft size={16} className="mr-2" />
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorFour;