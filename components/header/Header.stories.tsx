import HeaderContainer from "./Header";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library'
import otaku from '../../public/images/otaku_man.png'

export default {
    title: 'header_container',
    components: HeaderContainer
} as ComponentMeta<typeof HeaderContainer>

const Template: ComponentStory<typeof HeaderContainer> = () => {
    return <HeaderContainer />
}
export const Primary = Template.bind({})
Primary.args = {
    user_image_url: String(otaku),
    username: 'John Doe'
}

Primary.play = async ({}) => {
    const button = screen.getByRole('account_triangle')

    await userEvent.click(button)
}