import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminAuthContext } from "../hooks/useAdminAuthContext.js"
import useInternContext from "../hooks/useInternContext.js"
export const AdminConsole = () => {
  const { adm } = useAdminAuthContext()
  const { interns, dispatch } = useInternContext()
  const [search, setSearch] = useState()
  const [userAccount, set_userAccount] = useState({})
  const [data, setData] = useState([])
  
  useEffect(() => {
    const findUser = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/db/admin/${adm.email}`,
        {
          headers: {
            Authorization: `Bearer ${adm.token}`,
          },
        }
      ).catch((err) => console.log(err))
      const json = await response.json();
      if (response.ok) {
        set_userAccount(json)
      }

    };
    const fetchInterns = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/db/interns`,
        {
          headers: {
            Authorization: `Bearer ${adm.token}`,
          },
        }
      );
  
      const json = await response.json();
      setData(json);
      if (response.ok) {
        dispatch({ type: "SET_INTERN", payload: json });
      }
    };
    if (adm) {
      findUser()
      fetchInterns()
    }
  }, [])
  return (<>
    <div class='admin-panel-wrapper'>
      <div class="search-box">
        <p>Search: </p><input type="text" onChange={(evnt) => { setSearch(evnt.target.value) }} placeholder='Name, (ex. ROMEO)' />
      </div>
      <div class="intern-lists">
        {!search ? <>{interns &&
          interns.map((intern) => (
            <Link to={`/control/account/${intern._id}`}>
              <div class="intern-card">
                <h3>{intern.name}</h3>
                <p>{intern.email}</p>
                <p>{intern.id_no}</p>
                <p>{intern.course}</p>
                <p></p>
              </div></Link>
          ))}</>:
          <>
          {data.filter(item => item.name.toString().toLowerCase().includes(search.toString().toLowerCase() )).map((intern) => (
          <Link to={`/control/account/${intern._id}`}>
            <div class="intern-card">
              <h3>{intern.name}</h3>
              <p>{intern.email}</p>
              <p>{intern.id_no}</p>
              <p>{intern.course}</p>
              <p></p>
            </div></Link>))}
          </>}
        
        
      </div>
    </div>
  </>)
}
