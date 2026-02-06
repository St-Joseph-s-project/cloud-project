export interface BlogType{
  title: string,
  description: string,
  createdAt: string,
  upVote: number,
  downVote: number,
  userName: string
} 

export interface GetAllBlogsType {
  success: boolean,
  data: BlogType[]
} 

export interface AddBlogType {
  
}