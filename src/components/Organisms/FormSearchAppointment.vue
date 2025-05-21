<template>
  <div
    class="w-full max-w-4xl mx-auto px-6 my-14 rounded-md py-6"
    style="
      box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1),
        0 -8px 15px -3px rgba(0, 0, 0, 0.1);
    "
  >
    <PageTitle
      title="Search for your appointment"
      :sizeRem="1.3"
      color="primary"
      class="text-left mb-8"
    />
    <form action="" class="text-left">
      <Input
        label="Email"
        inputId="email"
        placeholder="your.email@example.com"
        class="mb-6"
      />
      <div class="flex items-center my-4">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="mx-4 text-gray-400 font-semibold">OR</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      <Input
        label="Phone Number"
        inputId="phone"
        placeholder="+33 6 12 34 56 78"
      />
      <Button type="submit" class="mt-6">Search</Button>
    </form>
  </div>
</template>

<script>
import PageTitle from "../Atoms/PageTitle.vue"
import Button from "../Atoms/Button.vue"
import Input from "../Atoms/Input.vue"
export default {
  components: { PageTitle, Button, Input },
}
</script>
