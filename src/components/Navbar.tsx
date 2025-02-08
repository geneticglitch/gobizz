"use client";

import { Avatar, Dropdown, Navbar, Button } from "flowbite-react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar_Component() {
  const { data: session } = useSession();

  return (
    <Navbar className = "bg-white" fluid rounded>
      <Navbar.Brand>
        <img src="/globe.svg" className="mr-3 h-6 sm:h-9" alt="logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-black">
          GoBizz
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {session ? (
          
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={session?.user?.image || "/default.jpg"}
                rounded
              />
            }
          >
            
            <Dropdown.Header>
              <span className="block text-sm">{session?.user?.name}</span>
              <span className="block truncate text-sm font-medium">{session?.user?.email}</span>
            </Dropdown.Header>
            <Dropdown.Item href = "/dashboard/editBusiness">Edit Business</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link className = "text-lg" href="/">
          Home
        </Navbar.Link>
        <Navbar.Link className = "text-lg" href="/about">About</Navbar.Link>
        <Navbar.Link className = "text-lg" href="/explore">Explore</Navbar.Link>
        <Navbar.Link className = "text-lg" href="/dashboard">Dashboard</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default Navbar_Component;
