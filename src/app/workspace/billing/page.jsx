import { PricingTable } from '@clerk/nextjs'
import React from 'react'
import PageHeader from '../_components/page-header'

export const metadata = {
    title: "Planos",
    description: "Escolha um plano para desbloquear a criação de mais cursos com IA.",
};

function Billing() {

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                items={[{ label: 'Planos' }]}
                title="Escolha um plano"
                description="Assine um plano para desbloquear a criação de mais cursos com IA."
            />
            <PricingTable/>
        </div>
    )
}

export default Billing
