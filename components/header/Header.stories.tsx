import HeaderContainer from './Header'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, fireEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

export default {
    title: 'header_container',
    components: HeaderContainer,
    decorators: [
        (Story) => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0'
                }}
            >
                <Story />
            </div>
        )
    ]
} as ComponentMeta<typeof HeaderContainer>

const TestSession: SessionProviderProps['session'] = {
    user: {
        name: 'sample_test_man_storybook',
        email: 'test_man@email.com',
        image: '/images/otaku_girl.png'
    },
    expires: '2100-12-07T17:38:00.891Z'
}

const Template_1: ComponentStory<typeof HeaderContainer> = () => {
    return (
        <SessionProvider session={TestSession}>
            <HeaderContainer />
        </SessionProvider>
    )
}

export const Primary = Template_1.bind({})
Primary.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('account_triangle')
    expect(button).toBeInTheDocument()
    await fireEvent.click(button)
}

const Template_2: ComponentStory<typeof HeaderContainer> = () => {
    return (
        <SessionProvider session={null}>
            <HeaderContainer />
        </SessionProvider>
    )
}
export const Secondary = Template_2.bind({})
Secondary.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('account_triangle')
    expect(button).toBeInTheDocument()
    await fireEvent.click(button)
}
