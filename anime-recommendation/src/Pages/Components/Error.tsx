interface ErrorProps {
    message: string | null;
}

function Error({ message }: ErrorProps) {
  return (
    <div className="error">{message}</div>
  )
}

export default Error