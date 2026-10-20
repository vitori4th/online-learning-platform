// Cobrança desativada temporariamente para o TCC.
// import { PricingTable } from '@clerk/nextjs'
import React from 'react'
import PageHeader from '../_components/page-header'

export const metadata = {
    title: "Planos",
    // description: "Escolha um plano para desbloquear a criação de mais cursos com IA.",
    description: "Uso acadêmico sem assinatura.",
};

function Billing() {

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                items={[{ label: 'Planos' }]}
                // title="Escolha um plano"
                // description="Assine um plano para desbloquear a criação de mais cursos com IA."
                title="Uso acadêmico"
                description="A criação de cursos está disponível sem assinatura."
            />
            {/* Tabela de preços desativada temporariamente para o TCC.
            <PricingTable/>
            */}
        </div>
    )
}

export default Billing
