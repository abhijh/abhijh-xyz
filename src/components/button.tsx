import React, {useState} from 'react';

type ButtonProps = {
  title: string
}

export const Button = (props: ButtonProps) => {
  const [count, setCount] = useState(0)
  return <>
    <p>Count = {count}</p>
    <button onClick={() => setCount(count+1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {props.title}
    </button>
  </>
}
