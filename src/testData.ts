export interface ColumnProps {
    id:number;
    title:string;
    avatar?:string;
    description:string;
}
export interface PostProps {
    id: number;
    title: string;
    content: string;
    image?: string;
    createAt: string;
    columnId: number;
}
export const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'title',
    avatar: '',
    description: 'description'
  }
]
export const testProps: PostProps[] = [
  {
    id: 1,
    title: 'title',
    content: 'content',
    image: 'image',
    createAt: '2022-11-02 00:00:00',
    columnId: 1
  }
]
