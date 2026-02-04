import { LucideProps } from "lucide-react";

export const Icon = {
  github: (props: LucideProps) => {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="black"
        className="bi bi-github"
        viewBox="0 0 16 16"
        {...props}
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
      </svg>
    );
  },
  google: (props: LucideProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
        {...props}
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
    );
  },
  facebook: (props: LucideProps) => {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 50 50"
      >
        <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
      </svg>
    );
  },
  loading: (props: LucideProps) => {
    return (
      <svg
        fill="#ffffff"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect x="1" y="4" width="6" height="14" opacity="1">
          <animate
            id="spinner_aqiq"
            begin="0;spinner_xVBj.end-0.25s"
            attributeName="y"
            dur="0.75s"
            values="1;5"
            fill="freeze"
          />
          <animate
            begin="0;spinner_xVBj.end-0.25s"
            attributeName="height"
            dur="0.75s"
            values="22;14"
            fill="freeze"
          />
          <animate
            begin="0;spinner_xVBj.end-0.25s"
            attributeName="opacity"
            dur="0.75s"
            values="1;.2"
            fill="freeze"
          />
        </rect>
        <rect x="9" y="4" width="6" height="14" opacity=".4">
          <animate
            begin="spinner_aqiq.begin+0.15s"
            attributeName="y"
            dur="0.75s"
            values="1;5"
            fill="freeze"
          />
          <animate
            begin="spinner_aqiq.begin+0.15s"
            attributeName="height"
            dur="0.75s"
            values="22;14"
            fill="freeze"
          />
          <animate
            begin="spinner_aqiq.begin+0.15s"
            attributeName="opacity"
            dur="0.75s"
            values="1;.2"
            fill="freeze"
          />
        </rect>
        <rect x="17" y="4" width="6" height="14" opacity=".3">
          <animate
            id="spinner_xVBj"
            begin="spinner_aqiq.begin+0.3s"
            attributeName="y"
            dur="0.75s"
            values="1;5"
            fill="freeze"
          />
          <animate
            begin="spinner_aqiq.begin+0.3s"
            attributeName="height"
            dur="0.75s"
            values="22;14"
            fill="freeze"
          />
          <animate
            begin="spinner_aqiq.begin+0.3s"
            attributeName="opacity"
            dur="0.75s"
            values="1;.2"
            fill="freeze"
          />
        </rect>
      </svg>
    );
  },
  gmail: (props: LucideProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 48 48"
        {...props}
      >
        <path
          fill="#4caf50"
          d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
        ></path>
        <path
          fill="#1e88e5"
          d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
        ></path>
        <polygon
          fill="#e53935"
          points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
        ></polygon>
        <path
          fill="#c62828"
          d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
        ></path>
        <path
          fill="#fbc02d"
          d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
        ></path>
      </svg>
    );
  },
  outlook: (props: LucideProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 48 48"
        {...props}
      >
        <path
          fill="#1a237e"
          d="M43.607,23.752l-7.162-4.172v11.594H44v-6.738C44,24.155,43.85,23.894,43.607,23.752z"
        ></path>
        <path
          fill="#0c4999"
          d="M33.919,8.84h9.046V7.732C42.965,6.775,42.19,6,41.234,6H17.667c-0.956,0-1.732,0.775-1.732,1.732 V8.84h9.005H33.919z"
        ></path>
        <path
          fill="#0f73d9"
          d="M33.919,33.522h7.314c0.956,0,1.732-0.775,1.732-1.732v-6.827h-9.046V33.522z"
        ></path>
        <path
          fill="#0f439d"
          d="M15.936,24.964v6.827c0,0.956,0.775,1.732,1.732,1.732h7.273v-8.558H15.936z"
        ></path>
        <path
          fill="#2ecdfd"
          d="M33.919 8.84H42.964999999999996V16.866999999999997H33.919z"
        ></path>
        <path
          fill="#1c5fb0"
          d="M15.936 8.84H24.941000000000003V16.866999999999997H15.936z"
        ></path>
        <path fill="#1467c7" d="M24.94 24.964H33.919V33.522H24.94z"></path>
        <path
          fill="#1690d5"
          d="M24.94 8.84H33.919V16.866999999999997H24.94z"
        ></path>
        <path
          fill="#1bb4ff"
          d="M33.919 16.867H42.964999999999996V24.963H33.919z"
        ></path>
        <path
          fill="#074daf"
          d="M15.936 16.867H24.941000000000003V24.963H15.936z"
        ></path>
        <path fill="#2076d4" d="M24.94 16.867H33.919V24.963H24.94z"></path>
        <path
          fill="#2ed0ff"
          d="M15.441,42c0.463,0,26.87,0,26.87,0C43.244,42,44,41.244,44,40.311V24.438 c0,0-0.03,0.658-1.751,1.617c-1.3,0.724-27.505,15.511-27.505,15.511S14.978,42,15.441,42z"
        ></path>
        <path
          fill="#139fe2"
          d="M42.279,41.997c-0.161,0-26.59,0.003-26.59,0.003C14.756,42,14,41.244,14,40.311V25.067 l29.363,16.562C43.118,41.825,42.807,41.997,42.279,41.997z"
        ></path>
        <path
          fill="#00488d"
          d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
        ></path>
        <path
          fill="#fff"
          d="M13.914,18.734c-3.131,0-5.017,2.392-5.017,5.343c0,2.951,1.879,5.342,5.017,5.342 c3.139,0,5.017-2.392,5.017-5.342C18.931,21.126,17.045,18.734,13.914,18.734z M13.914,27.616c-1.776,0-2.838-1.584-2.838-3.539 s1.067-3.539,2.838-3.539c1.771,0,2.839,1.585,2.839,3.539S15.689,27.616,13.914,27.616z"
        ></path>
      </svg>
    );
  },
};
