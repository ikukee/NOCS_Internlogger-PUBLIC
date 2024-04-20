import { React, useEffect, useState } from 'react'
import { useAuthenticateContext } from "../hooks/useAuthenticateContext.js";
import UpdatePasswordForm from '../components/UpdatePasswordForm.js';
export const Profile = () => {
  const { user } = useAuthenticateContext();

  const [user_account, set_userAccount] = useState({});

  useEffect(() => {
    const findUser = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_LINK}/api/account/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        set_userAccount(json)
      }
    };
    if (user) {
      findUser()
    }
  }, [user])

  return (
    <div class="profile_wrapper">
      <div class="profile_info">
        <h3>PROFILE INFO</h3>
        <p><b>ID: </b>{user_account.id_no}</p>
        <p><b>EMAIL: </b>{user_account.email}</p>
        <p><b>NAME: </b>{user_account.name}</p>
        <p><b>COURSE: </b>{user_account.course}</p>
        <p><b>CONTACT#: </b>{user_account.contact_no}</p>
        <p><b>SCHOOL: </b>{user_account.school}</p>
      </div>
      <div>
        <h3>SECURITY</h3>
        <UpdatePasswordForm user={user} />
      </div>
    </div>
  )
}
