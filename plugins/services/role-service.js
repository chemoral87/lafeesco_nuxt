export default class RoleService { 

  getRoles(options){
    const res  = axios.get('/roles', { params: options });
    return res;
  }
  
}