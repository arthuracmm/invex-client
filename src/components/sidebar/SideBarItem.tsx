import { Divider, Tooltip } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import YardIcon from '@mui/icons-material/Yard';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import OutboundIcon from '@mui/icons-material/Outbound';
import OutboundOutlinedIcon from '@mui/icons-material/OutboundOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { JSX } from "react";
import { useRouter } from "next/navigation";

export const SideBarArrayitems = [
    {
        type: 'item',
        name: 'Home',
        title: 'Pagina Inicial',
        label: 'home',
        service: 'stock',
        icon: <HomeIcon />,
        iconOutlined: <HomeOutlinedIcon />
    },
    {
        type: 'item',
        name: 'Produtos',
        title: 'Gestão dos agendamentos dos pacientes',
        label: 'products',
        service: 'stock',
        icon: <YardIcon />,
        iconOutlined: <YardOutlinedIcon />
    },
    {
        type: 'item',
        name: 'Entrada',
        title: 'Gestão de agenda dos profissionais',
        label: 'entry',
        service: 'stock',
        icon: <AddCircleIcon />,
        iconOutlined: <AddCircleOutlineOutlinedIcon />
    },
    {
        type: 'item',
        name: 'Saida',
        title: 'Gestão de agenda dos profissionais',
        label: 'output',
        service: 'stock',
        icon: <OutboundIcon />,
        iconOutlined: <OutboundOutlinedIcon />
    },
    {
        type: 'item',
        name: 'Configurações',
        title: 'Configurações gerais do sistema',
        label: 'settings',
        service: 'stock',
        icon: <SettingsIcon />,
        iconOutlined: <SettingsOutlinedIcon />
    }
]

interface SideBarItemProps {
    item: {
        type: string
        name: string,
        title: string,
        label: string,
        service: string,
        icon: JSX.Element,
        iconOutlined: JSX.Element
    },
    activeTab: string,
    setActiveTab: React.Dispatch<React.SetStateAction<string>>,
    sidebarOpen: boolean | null;
    darkMode: boolean | null,
    setTitle: React.Dispatch<React.SetStateAction<string>>
}

export default function SideBarItem({
    item,
    activeTab,
    setActiveTab,
    sidebarOpen,
    darkMode,
    setTitle
}: SideBarItemProps) {
    const router = useRouter();

    return (
        <div
            className={`flex flex-col w-full ${item.label === "home" && "hidden md:flex"}`} key={item.label}
        >
            <div
                className={`flex w-full p-2 rounded-lg cursor-pointer transition-all border 
                    ${activeTab === item.label
                        ? (darkMode
                            ? 'bg-lime-900 text-lime-300 border-lime-300'
                            : 'bg-lime-100 text-lime-600 border-lime-300')
                        : (darkMode
                            ? 'border-zinc-400'
                            : 'border-zinc-300')}
                    ${sidebarOpen ? 'w-full' : 'w-0 justify-center'}
                `}
                onClick={() => {
                    setActiveTab(item.label);
                    if (item.title) setTitle(item.title);
                    router.push(`/${item.label}`);
                }}
            >
                <Tooltip title={!sidebarOpen && item.name} arrow>
                    <div
                        className={`
                            flex w-full items-center
                            ${item.type === 'module' ? 'justify-between' : ''}
                            ${item.type === 'item' && !sidebarOpen ? 'justify-center' : ''}
                        `}
                    >
                        <div className="flex h-full gap-2">
                            {activeTab === item.label ? item.icon : item.iconOutlined}

                            {sidebarOpen && (
                                <>
                                    <Divider
                                        orientation='vertical'
                                        sx={{
                                            borderColor:
                                                activeTab === item.label
                                                    ? '#bef264'
                                                    : undefined,
                                        }}
                                    />

                                    <p>{item.name}</p>
                                </>
                            )}
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
