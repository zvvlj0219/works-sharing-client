import ProfileScreen from './ProfileScreen'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, fireEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

export default {
    title: 'profileScreen_container',
    components: ProfileScreen
} as ComponentMeta<typeof ProfileScreen>

const Template: ComponentStory<typeof ProfileScreen> = (args) => {
    return <ProfileScreen {...args} />
}

export const Primary = Template.bind({})
Primary.parameters = {
    nextRouter: {
        path: 'profile/[userId]/user',
        asPath: 'profile/sample_userId/user',
        query: {
            userId: 'sample_userId'
        }
    }
}
Primary.args = {
    use_image_url: '/images/otaku_girl.png',
    username: 'John Doe',
    path: 'user'
}
Primary.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const profile_button = canvas.getByRole('tab_profile')
    expect(profile_button).toBeInTheDocument()
    await fireEvent.click(profile_button)

    const upload_button = canvas.getByRole('tab_upload')
    expect(upload_button).toBeInTheDocument()
    await fireEvent.click(upload_button)
}
