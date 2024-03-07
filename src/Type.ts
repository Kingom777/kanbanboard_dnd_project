export type Id=String | number ;

export type column={
id:Id,
title:String
}

export type Task={
    id:Id,
    columnId:Id,
    content:String
}