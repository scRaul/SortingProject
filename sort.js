function swap(list,i,j,swapList){
    swapList.push(i);
    swapList.push(j);
    let k = list[i];
    list[i] = list[j];
    list[j] = k;
}
function part(list, p, r, swapList,asc){
   let i = p-1;
    for(let j = p; j < r; j++){
        if(asc){
            if( list[j] < list[r]){
                i++;
                swap(list,i,j,swapList);
            }
        }else{
            if(list[j] > list[r]){
                i++;
                swap(list,i,j,swapList);
            }
        }
    }
    swap(list,i+1,r,swapList);
    return i+1;
}
function quickSort(list, p, r, swapList,asc=true){
    if ( p >= r) return;
    let q = part(list,p,r,swapList,asc);
    quickSort(list,p,q-1,swapList,asc);
    quickSort(list,q+1,r,swapList,asc);
}

function insertSort(list,swapList,asc=true){
    for(let j = 1; j < list.length;j++){
        key = list[j];
        i = j-1;
        if(asc){
            while( i >= 0 && list[i] > key ){
                list[i+1] =list[i];
                swapList.push(i+1);
                swapList.push(i);
                swapList.push(j);
                i--;
            }
        }else{
            while( i >= 0 && list[i] < key ){
                list[i+1] = list[i];
                i--;
            }
        }
        list[i+1] = key;
        swapList.push(i+1);
        swapList.push(j);
        swapList.push(j);
    }
    return swapList;
}
// 
// void merge(vector<double> &v,int p,int q, int r,bool asc){
//     int n = q-p;
//     int m = r-q;
//     vector<double> left,right;
//     for(int i = 0; i <= n;i++)
//         left.push_back(v[p+i]);
//     for(int i = 1;i <= m;i++)
//         right.push_back(v[q+i]);
//     
//     int MAX_INT = 2147483647;
//     if(!asc) MAX_INT *=-1;
//     left.push_back(MAX_INT);
//     right.push_back(MAX_INT);
//     
//     int i = 0;
//     int j = 0;
//     for(int k = p; k <= r; k++){
//         if(asc){
//             if(left[i] <= right[j] ){
//                 v[k] = left[i];
//                 i++;
//             }else{
//                 v[k] = right[j];
//                 j++;
//             }
//         }else{
//             if(left[i] >= right[j] ){
//                 v[k] = left[i];
//                 i++;
//             }else{
//                 v[k] = right[j];
//                 j++;
//             }
//         }
//     }
// }
// void mergeSort(vector<double> &v,int p, int r, bool asc){
//     if( p >= r) return;
//     int  q = (p+r)/2;
//     mergeSort(v,p,q,asc);
//     mergeSort(v,q+1,r,asc);
//     merge(v,p,q,r,asc);
// }
