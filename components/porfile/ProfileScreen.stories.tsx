import ProfileScreen from "./ProfileScreen";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library'
import girl from '../../public/images/otaku_girl.png'

export default {
    title: 'profileScreen_container',
    components: ProfileScreen,
} as ComponentMeta<typeof ProfileScreen>

const Template: ComponentStory<typeof ProfileScreen> = (args) => {
    return <ProfileScreen {...args} />
}

export const Primary = Template.bind({})
Primary.args = {
    use_image_url: String(girl),
    username: 'John Doe',
}
Primary.play = async ({}) => {
    const profile_button = screen.getByRole('tab_profile')
    await userEvent.click(profile_button)

    const upload_button = screen.getByRole('tab_upload')
    await userEvent.click(upload_button)
}
