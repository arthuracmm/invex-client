import { useState, useEffect } from "react";
import { Divider, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ShortcutListener from "@/src/ui/ShortcutListener";
import { Users } from "@/src/types/Users";
import { usersService } from "@/src/service/users/usersService";
import UsersTable from "./UsersTable";
import UsersModal from "./UsersModal";

interface UsersContentProps {
    darkMode: boolean | null
}

export default function UsersContent({ darkMode }: UsersContentProps) {
    const [users, setUsers] = useState<Users[]>([]);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);

    const fetchUsers = async () => {
        try {
            const data = await usersService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full justify-between items-center ">
                <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'} `}>Usuarios</h1>
            </div>
            <Divider />
            <UsersTable
                users={users}
                darkMode={darkMode}
                setSelectedUser={setSelectedUser}
            />
            <UsersModal
                open={selectedUser !== null}
                onClose={() => setSelectedUser(null)}
                darkMode={darkMode}
                selectedUser={selectedUser}
                fetchUsers={fetchUsers}
            />
        </div>
    )
}