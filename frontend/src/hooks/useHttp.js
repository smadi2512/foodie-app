import { useState, useCallback, useRef, useEffect } from "react";

//Helper function for sending HTTP request
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);
  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || `HTTP Error! Status: ${response.status}`
    );
  }
  return resData;
}

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequest = useRef();

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      setError(null);

      if (activeHttpRequest.current) {
        activeHttpRequest.current.abort();
      }

      const controller = new AbortController();
      activeHttpRequest.current = controller;

      try {
        const resData = await sendHttpRequest(url, {
          ...config,
          signal: activeHttpRequest.current.signal,
          body: JSON.stringify(data),
        });
        setData(resData);
      } catch (error) {
        if (error.name === "AbortError") return;
        setError(error.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    },
    [url, config]
  );

  const clearData = () => setData(initialData);

  useEffect(() => {
    //Exceute the GET method requests
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }

    //Clean up for the controller
    return () => {
      if (activeHttpRequest.current) activeHttpRequest.current.abort();
    };
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest, //To be exceuted on demand
    clearData,
  };
}
