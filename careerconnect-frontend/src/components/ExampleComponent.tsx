type Props = {
    title: string;
  };
  
  export default function ExampleComponent({ title }: Props) {
    return <h2 className="text-2xl font-bold">{title}</h2>;
  }
  