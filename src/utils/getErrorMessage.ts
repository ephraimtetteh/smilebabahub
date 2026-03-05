import axios from "axios";

const getErrorMessage = (error: unknown) => {
  if(axios.isAxiosError(error)) {
    return error?.response?.data?.message || 'server error'
  }

  return 'Unexpected error occured'
}

export default getErrorMessage;