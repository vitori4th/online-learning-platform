"use client"
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SelectedChapterIndexContext } from '@/context/selected-chapter-index-context';
import { UserDetailContext } from '@/context/user-detail-context';
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import React, { useEffect, useState } from "react"

function Provider({ children }) {

    const { user } = useUser();
    const [userDetail, setUserDetail] = useState();
    const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
    useEffect(() => {
        user && CreateNewUser();
    }, [user])

    const CreateNewUser = async () => {
        const result = await axios.post('/api/user', {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress
        })
        console.log(result.data)
        setUserDetail(result.data)
    }
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <SelectedChapterIndexContext.Provider value={{ selectedChapterIndex, setSelectedChapterIndex }}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div>{children}</div>
                    <Toaster richColors />
                </ThemeProvider>
            </SelectedChapterIndexContext.Provider>
        </UserDetailContext.Provider>
    )
}

export default Provider
