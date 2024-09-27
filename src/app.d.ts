// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	import Fa from 'svelte-fa/dist/fa.svelte'
	import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons/index.es'

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@fortawesome/pro-solid-svg-icons/index.es' {
	export * from '@fortawesome/pro-solid-svg-icons';
}

export {};
