import { React, useEffect, useState } from 'react'
import UpdateAdminPasswordForm from '../components/UpdateAdminPasswordForm.js';
import { useAdminAuthContext } from '../hooks/useAdminAuthContext.js';
export const AdminProfile = () => {
  const { adm } = useAdminAuthContext();

  const [user_account, set_userAccount] = useState({});

  useEffect(() => {
    const findUser = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/db/admin/${adm.email}`,
        {
          headers: {
            Authorization: `Bearer ${adm.token}`,
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        set_userAccount(json)
      }
    };
    if (adm) {
      findUser()
    }
  }, [adm])

  return (
    <div class="profile_wrapper">
      <div class="profile_info">
        <h3>PROFILE INFO</h3>
        <p><b>ID: </b>{user_account.id_no}</p>
        <p><b>EMAIL: </b>{user_account.email}</p>
      </div>
      <div>
        <h3>SECURITY</h3>
        <UpdateAdminPasswordForm user={adm} account={user_account}/>
      </div>
    </div>
  )
}
