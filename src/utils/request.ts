import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  TRequestData,
  TRequestOptions,
  TCheckResponse,
  TCheckSuccess,
  TCreateAsyncAction,
} from './types'

const path = 'https://norma.nomoreparties.space/api/'

export const socketPath = 'wss://norma.nomoreparties.space/orders/all'

export const socketPathProfile = 'wss://norma.nomoreparties.space/orders'

export const allOrdersPath = 'https://norma.nomoreparties.space/api/ingredients'

const checkResponse: TCheckResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Error ${res.status}`)
}

const checkSuccess: TCheckSuccess = (res: any) => {
  //console.log(res)

  return res && res.success ? res : Promise.reject(`Answer on success ${res}`)
}

export const createAsyncAction = ({
  prefix,
  route,
  method = 'GET',
}: TCreateAsyncAction) => {
  return createAsyncThunk(
    `${prefix}`,
    async (requestData: null | TRequestData = null) => {
      return request(route, method, requestData)
    }
  )
}

export const request = (
  route: string,
  method: string,
  requestData: TRequestData | null
) => {
  const url = `${path}${route}`
  const requestOptions: TRequestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }

  if (requestData?.token) {
    requestOptions.headers['Authorization'] =
      'Bearer ' + requestData.token.accessToken
  }

  if (requestData?.body) {
    requestOptions.body = JSON.stringify(requestData.body)
  }

  return fetch(url, requestOptions)
    .then(checkResponse)
    .then(checkSuccess)
    .catch((error) => console.log(`Error ${error.status}`))
}
