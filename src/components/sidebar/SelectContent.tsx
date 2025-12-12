import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { SelectChangeEvent, selectClasses } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InventoryIcon from '@mui/icons-material/Inventory';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
    width: 28,
    height: 28,
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.secondary,
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
    minWidth: 0,
    marginRight: 12,
});

interface SelectContentProps {
    serviceSelected: string
    setServiceSelected: React.Dispatch<React.SetStateAction<string>>;
    sidebarOpen: boolean | null;
}

export default function SelectContent({ serviceSelected, setServiceSelected, sidebarOpen }: SelectContentProps) {

    const services = [
        {
            name: 'stock',
            label: 'Estoque',
            icon: InventoryIcon
        },
    ]

    React.useEffect(() => {
        const saved = localStorage.getItem("serviceSelected");

        if (saved) {
            setServiceSelected(saved);
            return;
        }

        if (services && services.length > 0 && serviceSelected === '') {
            setServiceSelected(services[0].name);
            localStorage.setItem("serviceSelected", services[0].name);
        }
    }, [services]);

    const handleChange = (event: SelectChangeEvent) => {
        const selected = event.target.value as string;
        setServiceSelected(selected);
        localStorage.setItem("serviceSelected", selected);
    };

    return (
        <Select
            labelId="service-select"
            id="service-simple-select"
            value={serviceSelected || ''}
            onChange={handleChange}
            displayEmpty
            fullWidth
            renderValue={(selected) => {
                const srv = services.find(s => s.name === selected);

                if (!srv) return "";

                    if (!sidebarOpen) {
                        return (
                            <Avatar sx={{ width: 28, height: 28 }}>
                                <srv.icon className="text-lime-500" sx={{ fontSize: "1rem" }} />
                            </Avatar>
                        );
                    }

                return (
                    <div className="flex flex-1 items-center">
                        <ListItemAvatar>
                            <Avatar alt={`${srv.label}`}>
                                <srv.icon sx={{ fontSize: '1rem' }} className='text-lime-500' />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${srv.label}`}
                            secondary="Serviço"
                            primaryTypographyProps={{ sx: { fontSize: "0.9rem" } }}
                            secondaryTypographyProps={{ sx: { fontSize: "0.7rem" } }}
                        />
                    </div>
                );
            }}
            sx={{
                maxHeight: 65,
                mx: 2,
                p: sidebarOpen ? 2 : 1,
                minWidth: sidebarOpen ? 160 : 56,
                [`& .${selectClasses.select}`]: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    pl: sidebarOpen ? 1 : 0,
                },
                '& .MuiOutlinedInput-notchedOutline': { border: '1', borderColor: '#e4e4e7' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1', borderColor: '#e4e4e7' },
                '&:hover .MuiOutlinedInput-notchedOutline': { border: '1', borderColor: '#e4e4e7' },
                '& .MuiOutlinedInput-root': { boxShadow: 'none !important' },
            }}
        >
            <ListSubheader>Serviços</ListSubheader>

            {services.map((srv) => (
                <MenuItem key={srv.name} value={srv.name}>
                    <ListItemAvatar>
                        <Avatar alt={`${srv.label}`}>
                            <srv.icon sx={{ fontSize: '1rem' }} className='text-lime-500' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${srv.label}`}
                        secondary="Serviço"
                        primaryTypographyProps={{ sx: { fontSize: "0.9rem" } }}
                        secondaryTypographyProps={{ sx: { fontSize: "0.7rem" } }}
                    />
                </MenuItem>
            ))}

            <a href="https://github.com/arthuracmm" className='flex items-center w-full px-4 hover:bg-zinc-100' target='_blank'>
                <ListItemAvatar>
                    <Avatar>
                        <AddRoundedIcon sx={{ fontSize: '1rem' }} className='text-lime-500' />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="Novo Serviço"
                    secondary="Clique e saiba mais"
                    primaryTypographyProps={{ sx: { fontSize: "0.9rem" } }}
                    secondaryTypographyProps={{ sx: { fontSize: "0.7rem" } }}
                />
            </a>

        </Select>
    );
}