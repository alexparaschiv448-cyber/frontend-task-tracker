import '../index.css'

export default function Pages({page,onPageChange,limit,pageLimit}) {
    const lastPage=Math.ceil(limit/pageLimit);
    let pages=[];
    if(page===1){pages.push(<button data-id={1} className="px-3 py-1 bg-blue-300 text-gray-700 rounded-md hover:bg-blue-400 transition" onClick={onPageChange}>
        1
    </button>);}
    else{pages.push(<button data-id={1} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition" onClick={onPageChange}>
        1
    </button>);}
    if(page>=4){
        pages.push(<p>...</p>);
    }
    for(let i = 2;i<=lastPage;i++){
        if(i===lastPage){
            if(i===page){
                pages.push(<button data-id={i} className="px-3 py-1 bg-blue-300 text-gray-700 rounded-md hover:bg-blue-400 transition" onClick={onPageChange}>
                    {i}
                </button>)
            }else{
                pages.push(<button data-id={i} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition" onClick={onPageChange}>
                    {i}
                </button>)
            }
            break;
        }
        else if(i===page+2 && i<lastPage){
            pages.push(<p>...</p>);
            pages.push(<button data-id={lastPage} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition" onClick={onPageChange}>
                {lastPage}
            </button>)
            break;
        }
        if(i!==page && (i>=page-1 || i<=pages+1)){
            pages.push(<button data-id={i} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition" onClick={onPageChange}>
                {i}
            </button>)
        }else if(i===page){
            pages.push(<button data-id={i} className="px-3 py-1 bg-blue-300 text-gray-700 rounded-md hover:bg-blue-400 transition" onClick={onPageChange}>
                {i}
            </button>)
        }
    }


    return(
        <>
            <div className="absolute bottom-4 right-4 flex gap-2">
                {pages}
            </div>
        </>
    )
}