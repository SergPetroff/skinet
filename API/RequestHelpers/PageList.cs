using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PageList<T> : List<T>
    {
        public PageList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)

            };
            AddRange(items);
        }

        public MetaData MetaData {get; set;}

        public static async Task<PageList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize){

            var count = query.Count();
            var skip = (pageNumber-1)*pageSize; 
            var items =  query.Skip(skip).Take(pageSize).ToList();

            return new PageList<T>(items,count, pageNumber, pageSize);        
        }
    }
}