import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { BsGithub } from "react-icons/bs";
import { GiFishing } from "react-icons/gi";

const Navigation = ({ breadcrumbs }) => {
  return (
    <Navbar isBordered classNames={{ wrapper: "max-w-[2000px] px-10" }}>
      <NavbarBrand>
        <div className="font-bold text-blue-400">E:Diom</div>
      </NavbarBrand>
      <NavbarContent className="gap-20" justify="center">
        <NavbarItem>
          <Link href="/" color="foreground">
            진단평가
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/input" color="foreground">
            대화 학습
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/dashboard" color="foreground">
            대시보드
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="shrink w-100" justify="end">
        <NavbarItem>
          <Button
            as={Link}
            className="bg-zinc-600 dark:bg-zinc-800 text-zinc-200"
            href="https://github.com/comedu-cute-members/WordFisher"
            variant="flat"
            startContent={<BsGithub size="20" />}
          >
            GitHub
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;
