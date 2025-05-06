import React from 'react'
import { Input, InputGroup, InputGroupText } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux-toolkit/Hooks';
import SvgIcon from '@/common-components/common-icon/CommonSvgIcons';
import { setSidebarSearchTerm } from '@/redux-toolkit/slices/layout/layoutSlice';

export default function SidebarSearch() {
    const dispatch = useDispatch();
    const {sidebarSearchTerm} = useAppSelector((state)=> state.layout)
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        dispatch(setSidebarSearchTerm(value));
    };
    return (
        <div className="sidebar-search">
            <InputGroup>
                <InputGroupText id="sidebar-search">
                    <SvgIcon iconId='search' />
                </InputGroupText>
                <Input type="text" placeholder="Quick search" value={sidebarSearchTerm} onChange={handleSearch} />
            </InputGroup>
        </div>
    )
}
