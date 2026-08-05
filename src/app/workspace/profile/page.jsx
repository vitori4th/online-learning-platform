import { UserProfile } from '@clerk/nextjs'
import React from 'react'
import PageHeader from '../_components/page-header'

export const metadata = {
    title: "Perfil",
    description: "Gerencie suas informações pessoais e preferências de conta.",
};

function Profile() {

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                items={[{ label: 'Perfil' }]}
                title="Gerencie seu perfil"
                description="Atualize suas informações pessoais, segurança e preferências de conta."
            />
            <UserProfile/>
        </div>
    )
}

export default Profile
