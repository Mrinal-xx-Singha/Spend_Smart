import Image from "next/image";
import Link from "next/link";
const Hero = () => {
  return (
    <section className="bg-gray-50 flex flex-col items-center">
      <div className="mx-auto max-w-screen-xl px-4 py-32 ">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Track Your Expenses Effectively
            <strong className="font-extrabold text-primary sm:block">
              {" "}
              Regain Control of Your Budget{" "}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            This intuitive platform empowers individuals to effortlessly record,
            categorize, and analyze their expenses, all while providing a sleek
            and user-friendly interface.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              href="/dashboard"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <Image
        src="/dash.jpg"
        alt="dashboard"
        width={1000}
        height={700}
        className="-mt-9 rounded-lg border-2"
      />
    </section>
  );
};

export default Hero;
