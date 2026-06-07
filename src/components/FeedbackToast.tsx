interface Props {
  message: string | null;
}

export default function FeedbackToast({ message }: Props) {
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg animate-bounce">
      {message}
    </div>
  );
}
